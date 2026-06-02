import csv
from io import BytesIO
from collections import Counter
from django.db.models import Count
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response as DRFResponse
from .models import Question, Response
from .serializers import QuestionSerializer, ResponseSerializer
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

class IsFacultyOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsFacultyOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class IsFacultyOrStudentCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

class ResponseViewSet(viewsets.ModelViewSet):
    serializer_class = ResponseSerializer
    permission_classes = [permissions.IsAuthenticated, IsFacultyOrStudentCreate]

    def get_queryset(self):
        return Response.objects.all().order_by('-submitted_at')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_responses_csv(request):
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="responses.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Question', 'Student', 'Answer', 'Submitted At'])
    
    for r in Response.objects.all().select_related('question', 'student'):
        writer.writerow([r.id, r.question.title, r.student.email, r.answer_text, r.submitted_at])
        
    return response

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_responses_pdf(request):
        
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="responses.pdf"'
    
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, "Student Responses")
    
    y = 720
    for r in Response.objects.all().select_related('question', 'student'):
        text = f"Q: {r.question.title} | Student: {r.student.email}"
        p.drawString(100, y, text)
        y -= 20
        ans = r.answer_text[:100] + "..." if len(r.answer_text) > 100 else r.answer_text
        p.drawString(120, y, f"A: {ans}")
        y -= 30
        if y < 100:
            p.showPage()
            y = 750
            
    p.save()
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_pie(request):
    """Response distribution across questions"""
        
    data = Question.objects.annotate(response_count=Count('responses')).values('id', 'title', 'response_count')
    
    labels = []
    series = []
    for d in data:
        labels.append(d['title'])
        series.append(d['response_count'])
        
    return DRFResponse({
        "labels": labels,
        "series": series
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_bar(request):
    """Question-wise participation (same as pie in this simple model)"""
        
    data = Question.objects.annotate(response_count=Count('responses')).values('id', 'title', 'response_count')
    
    labels = []
    series = []
    for d in data:
        labels.append(d['title'])
        series.append(d['response_count'])
        
    return DRFResponse({
        "labels": labels,
        "series": [{"name": "Responses", "data": series}]
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_histogram(request):
    """Response length distribution"""
        
    responses = Response.objects.all()
    lengths = [len(r.answer_text) for r in responses]
    
    # Simple binning
    bins = {"0-50": 0, "51-100": 0, "101-200": 0, "200+": 0}
    for l in lengths:
        if l <= 50: bins["0-50"] += 1
        elif l <= 100: bins["51-100"] += 1
        elif l <= 200: bins["101-200"] += 1
        else: bins["200+"] += 1
        
    return DRFResponse({
        "labels": list(bins.keys()),
        "series": [{"name": "Count", "data": list(bins.values())}]
    })
