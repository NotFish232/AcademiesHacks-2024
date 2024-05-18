from django.shortcuts import render
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Scene


@csrf_exempt
def create_view(request: HttpRequest) -> JsonResponse:

    file = request.FILES.get("file", None)

    if not file:
        return JsonResponse({}, status=400)

    Scene.objects.create(filename=file.name, content=file.read())

    return JsonResponse({}, status=200)


def list_view(request: HttpRequest) -> JsonResponse:
    scenes = Scene.objects.order_by("time").all()

    return JsonResponse([s.filename for s in scenes], safe=False)


def file_view(request: HttpRequest) -> HttpResponse:
    filename = request.GET.get("filename")

    scene = Scene.objects.get(filename=filename)

    return HttpResponse(scene.content, content_type="application/octet-stream")
