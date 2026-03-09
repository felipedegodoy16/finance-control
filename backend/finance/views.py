from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from .models import Category, PaymentMethod, Transaction
from .serializers import CategorySerializer, PaymentMethodSerializer, TransactionSerializer

class UserFilteredViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(UserFilteredViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PaymentMethodViewSet(UserFilteredViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class TransactionViewSet(UserFilteredViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        
        income = transactions.filter(type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        expense = transactions.filter(type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'total_income': float(income),
            'total_expense': float(expense),
            'balance': float(income - expense)
        })
