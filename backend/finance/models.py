from django.db import models
from django.conf import settings

class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#2D5A27") # Default green-ish
    type = models.CharField(max_length=10, choices=[('INCOME', 'Income'), ('EXPENSE', 'Expense')])

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.type})"

class PaymentMethod(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payment_methods')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
  
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

  category = models.ForeignKey(
    Category,
    on_delete=models.SET_NULL,
    null=True,
  )

  payment_method = models.ForeignKey(
    PaymentMethod,
    on_delete=models.SET_NULL,
    null=True,
  )

  amount = models.DecimalField(
    max_digits=10,
    decimal_places=2
  )

  type = models.CharField(
    max_length=10,
    choices=[('INCOME', 'Receita'), ('EXPENSE', 'Despesa')],
    default='EXPENSE'
  )

  description = models.TextField(blank=True, null=True)

  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.description