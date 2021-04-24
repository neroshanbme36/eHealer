
from django.views.generic import *
from .forms import SetPasswordForm
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib import messages
import hashlib
from django.shortcuts import render
from django.contrib.auth.hashers import make_password

class PasswordResetConfirmView(FormView):
  template_name = "account/forgotpassword.html"
  success_url = '/account/pwdresetted'
  form_class = SetPasswordForm

  def post(self, request, uidb64=None, token=None, *arg, **kwargs):
    form = self.form_class(request.POST)
    assert uidb64 is not None and token is not None 
    try:
        uid = urlsafe_base64_decode(uidb64)
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        if form.is_valid():
            new_password = form.cleaned_data['confirmation']
            user.password = make_password(new_password)
            user.save()
            messages.success(request, 'Your password has been modified')
            return self.form_valid(form)
        else:
            print(form.errors)
            messages.error(request, form.errors)
            return self.form_invalid(form)
    else:
        messages.error(
            request, 'This link has expired.')
        return self.form_invalid(form)

def pwdresetted(request):
  return render(request,'account/pwdresetted.html',{})