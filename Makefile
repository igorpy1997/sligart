include .env
export

app-dir = app
frontend-dir = frontend/frontend-app
admin-dir = frontend/sligart-admin

.PHONY: up
up: frontend-build admin-build
	docker compose --env-file .env -f docker-compose.yml up -d --build --timeout 60

.PHONY: down
down:
	docker compose --env-file .env -f docker-compose.yml down --timeout 60

.PHONY: build
build:
	docker compose --env-file .env -f docker-compose.yml build migrations server

# Команды для основного фронтенда
.PHONY: frontend-install
frontend-install:
	@echo "📦 Installing frontend dependencies..."
	cd $(frontend-dir) && npm install

.PHONY: frontend-build
frontend-build: frontend-install
	@echo "🔨 Building frontend..."
	cd $(frontend-dir) && npm run build
	@echo "✅ Frontend built successfully!"

.PHONY: frontend-dev
frontend-dev: frontend-install
	@echo "🚀 Starting frontend dev server..."
	cd $(frontend-dir) && npm start

.PHONY: frontend-clean
frontend-clean:
	@echo "🧹 Cleaning frontend build..."
	rm -rf $(frontend-dir)/build
	rm -rf $(frontend-dir)/node_modules

# Команды для админки
.PHONY: admin-install
admin-install:
	@echo "📦 Installing admin dependencies..."
	cd $(admin-dir) && npm install

.PHONY: admin-build
admin-build: admin-install
	@echo "🔨 Building admin..."
	cd $(admin-dir) && npm run build
	@echo "✅ Admin built successfully!"

.PHONY: admin-dev
admin-dev: admin-install
	@echo "🚀 Starting admin dev server..."
	cd $(admin-dir) && npm start

.PHONY: admin-clean
admin-clean:
	@echo "🧹 Cleaning admin build..."
	rm -rf $(admin-dir)/build
	rm -rf $(admin-dir)/node_modules

# Команды для обоих фронтов
.PHONY: frontend-install-all
frontend-install-all: frontend-install admin-install
	@echo "✅ All frontend dependencies installed!"

.PHONY: frontend-build-all
frontend-build-all: frontend-build admin-build
	@echo "✅ All frontends built successfully!"

.PHONY: frontend-dev-all
frontend-dev-all:
	@echo "🚀 Starting both dev servers..."
	@echo "Frontend will be on :3000, Admin on :3001"
	(cd $(frontend-dir) && PORT=3000 npm start) & \
	(cd $(admin-dir) && PORT=3001 npm start) & \
	wait

.PHONY: frontend-clean-all
frontend-clean-all: frontend-clean admin-clean
	@echo "✅ All frontend builds cleaned!"

# Полная пересборка всего
.PHONY: rebuild
rebuild: frontend-clean-all frontend-build-all build
	@echo "🎉 Full rebuild completed!"

.PHONY: pull
pull:
	git pull origin master
	git submodule update --init --recursive

.PHONY: extract-locales
extract-locales:
	uv run fast-ftl-extract \
	'.\app\bot' \
	'.\app\bot\locales' \
	-l 'en' \
	-l 'uk' \
	-K 'LF' \
	-I 'core' \
	--comment-junks \
	--comment-keys-mode 'comment' \
	--verbose

.PHONY: stub
stub:
	uv run ftl stub \
	'.\app\bot\locales\en' \
	'.\app\bot'

.PHONY: lint
lint:
	echo "Running ruff..."
	uv run ruff check --config pyproject.toml --diff $(app-dir)

.PHONY: format
format:
	echo "Running ruff check with --fix..."
	uv run ruff check --config pyproject.toml --fix --unsafe-fixes $(app-dir)

	echo "Running ruff..."
	uv run ruff format --config pyproject.toml $(app-dir)

	echo "Running isort..."
	uv run isort --settings-file pyproject.toml $(app-dir)

.PHONY: mypy
mypy:
	echo "Running MyPy..."
	uv run mypy --config-file pyproject.toml --explicit-package-bases $(app-dir)/$(bot-dir)

.PHONY: outdated
outdated:
	uv tree --outdated --universal

.PHONY: sync
sync:
	uv sync --extra dev --extra lint

.PHONY: create-revision
create-revision: build
	docker compose --env-file .env -f docker-compose.yml run --build --rm --user migrator migrations bash -c ".venv/bin/alembic --config alembic.ini revision --autogenerate -m '$(message)'"

.PHONY: upgrade-revision
upgrade-revision: build
	docker compose --env-file .env -f docker-compose.yml run --build --rm --user migrator migrations bash -c ".venv/bin/alembic --config alembic.ini upgrade $(revision)"

.PHONY: downgrade-revision
downgrade-revision: build
	docker compose --env-file .env -f docker-compose.yml run --build --rm --user migrator migrations bash -c ".venv/bin/alembic --config alembic.ini downgrade $(revision)"

.PHONY: current-revision
current-revision: build
	docker compose --env-file .env -f docker-compose.yml run --build --rm --user migrator migrations bash -c ".venv/bin/alembic --config alembic.ini current"

.PHONY: create-init-revision
create-init-revision: build
	docker compose --env-file .env -f docker-compose.yml run --build --rm --user migrator migrations bash -c ".venv/bin/alembic --config alembic.ini revision --autogenerate -m 'Initial' --rev-id 000000000000"

.PHONY: create-admin
create-admin: ## Create admin user
	chmod +x create_admin.sh && ./create_admin.sh