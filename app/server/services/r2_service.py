# app/server/services/r2_service.py
import io
import uuid
from PIL import Image
import boto3
from botocore.config import Config
from fastapi import UploadFile, HTTPException
from settings import Settings
from typing import Tuple


class R2Service:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = boto3.client(
            's3',
            endpoint_url=settings.r2.endpoint_url,
            aws_access_key_id=settings.r2.access_key_id,
            aws_secret_access_key=settings.r2.secret_access_key.get_secret_value(),
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )
        self.bucket_name = settings.r2.bucket_name
        self.public_url = settings.r2.public_url

    async def upload_file(
            self,
            file: UploadFile,
            folder: str,
            entity_type: str,
            entity_id: int,
            optimize_image: bool = True,
            max_size: Tuple[int, int] = (1200, 1200)
    ) -> str:
        """
        Универсальная загрузка файлов в R2

        Args:
            file: Загружаемый файл
            folder: Папка (avatars, projects/screenshots, technologies/icons, etc.)
            entity_type: Тип сущности (developer, project, technology)
            entity_id: ID сущности
            optimize_image: Оптимизировать ли изображение
            max_size: Максимальный размер для изображений
        """
        try:
            # Проверяем тип файла
            if optimize_image and not file.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="File must be an image")

            # Читаем файл
            file_content = await file.read()

            # Оптимизируем изображение если нужно
            if optimize_image and file.content_type.startswith('image/'):
                file_content = self._optimize_image(file_content, max_size)

            # Генерируем уникальное имя файла
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            file_key = f"{folder}/{entity_type}_{entity_id}_{uuid.uuid4().hex}.{file_extension}"

            # Загружаем в R2
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_content,
                ContentType=file.content_type,
                CacheControl='public, max-age=31536000'  # Кэш на год
            )

            # Возвращаем публичную ссылку
            public_url = f"{self.public_url}/{file_key}"
            return public_url

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

    # Специфичные методы для разных сущностей
    async def upload_avatar(self, file: UploadFile, developer_id: int) -> str:
        """Загружает аватар разработчика"""
        return await self.upload_file(
            file=file,
            folder="avatars",
            entity_type="developer",
            entity_id=developer_id,
            optimize_image=True,
            max_size=(300, 300)
        )

    async def upload_project_screenshot(self, file: UploadFile, project_id: int) -> str:
        """Загружает скриншот проекта"""
        return await self.upload_file(
            file=file,
            folder="projects/screenshots",
            entity_type="project",
            entity_id=project_id,
            optimize_image=True,
            max_size=(1200, 800)
        )

    async def upload_project_video(self, file: UploadFile, project_id: int) -> str:
        """Загружает видео проекта"""
        return await self.upload_file(
            file=file,
            folder="projects/videos",
            entity_type="project",
            entity_id=project_id,
            optimize_image=False  # Видео не оптимизируем
        )

    async def upload_technology_icon(self, file: UploadFile, technology_id: int) -> str:
        """Загружает иконку технологии"""
        return await self.upload_file(
            file=file,
            folder="technologies/icons",
            entity_type="technology",
            entity_id=technology_id,
            optimize_image=True,
            max_size=(128, 128)
        )

    async def upload_company_asset(self, file: UploadFile, asset_name: str) -> str:
        """Загружает общие ассеты компании (лого, фавикон и т.д.)"""
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'png'
        file_key = f"general/{asset_name}.{file_extension}"

        file_content = await file.read()

        # Оптимизируем если это изображение
        if file.content_type.startswith('image/'):
            file_content = self._optimize_image(file_content, (512, 512))

        self.client.put_object(
            Bucket=self.bucket_name,
            Key=file_key,
            Body=file_content,
            ContentType=file.content_type,
            CacheControl='public, max-age=31536000'
        )

        return f"{self.public_url}/{file_key}"

    def _optimize_image(self, image_content: bytes, max_size: Tuple[int, int]) -> bytes:
        """
        Оптимизирует изображение: ресайз и сжатие
        """
        try:
            # Открываем изображение
            image = Image.open(io.BytesIO(image_content))

            # Конвертируем в RGB если нужно
            if image.mode in ('RGBA', 'LA', 'P'):
                # Для PNG с прозрачностью сохраняем альфа-канал
                if image.mode == 'RGBA':
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    background.paste(image, mask=image.split()[-1])
                    image = background
                else:
                    image = image.convert('RGB')

            # Ресайзим с сохранением пропорций
            image.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Сохраняем оптимизированное изображение
            output = io.BytesIO()

            # Определяем качество в зависимости от размера
            if max_size[0] <= 300:  # Аватары
                quality = 85
            elif max_size[0] <= 600:  # Иконки технологий
                quality = 90
            else:  # Скриншоты проектов
                quality = 95

            image.save(output, format='JPEG', quality=quality, optimize=True)
            output.seek(0)

            return output.getvalue()

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")

    async def delete_file(self, file_url: str) -> bool:
        """
        Удаляет файл из R2 по URL
        """
        try:
            # Извлекаем ключ из URL
            if self.public_url in file_url:
                file_key = file_url.replace(f"{self.public_url}/", "")

                self.client.delete_object(
                    Bucket=self.bucket_name,
                    Key=file_key
                )
                return True
        except Exception as e:
            print(f"Failed to delete file: {e}")
            return False

    # Алиасы для обратной совместимости
    async def delete_avatar(self, avatar_url: str) -> bool:
        return await self.delete_file(avatar_url)

    async def delete_project_screenshot(self, screenshot_url: str) -> bool:
        return await self.delete_file(screenshot_url)

    async def delete_technology_icon(self, icon_url: str) -> bool:
        return await self.delete_file(icon_url)