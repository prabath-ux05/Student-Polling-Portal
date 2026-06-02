from rest_framework import serializers
from .models import Question, Response

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ['id', 'question', 'student', 'answer_text', 'submitted_at']
        read_only_fields = ['id', 'student', 'submitted_at']
