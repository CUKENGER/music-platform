COMPOSE=docker compose -f docker-compose.yml

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

restart:
	$(COMPOSE) down && $(COMPOSE) up -d --build

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down -v --remove-orphans
