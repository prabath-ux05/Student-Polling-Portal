from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'questions', views.QuestionViewSet, basename='question')
router.register(r'responses', views.ResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
    path('export/responses/csv/', views.export_responses_csv, name='export-responses-csv'),
    path('export/responses/pdf/', views.export_responses_pdf, name='export-responses-pdf'),
    path('analytics/pie/', views.analytics_pie, name='analytics-pie'),
    path('analytics/bar/', views.analytics_bar, name='analytics-bar'),
    path('analytics/histogram/', views.analytics_histogram, name='analytics-histogram'),
]
