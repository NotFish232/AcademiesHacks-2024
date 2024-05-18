from django.shortcuts import render
from django.http import HttpRequest, JsonResponse


# Create your views here.
def index_view(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"test": "thing"})
