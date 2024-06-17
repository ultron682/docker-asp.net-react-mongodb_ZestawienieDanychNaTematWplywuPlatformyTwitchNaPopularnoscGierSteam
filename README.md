# ProjektIntegracjaSystem-w

## Docker Compose

```
docker-compose up --build
```

## Docker Swarm

Dodawanie stacka

```
docker swarm init
docker-compose -f docker-compose_for_stack.yml build
docker stack deploy -c docker-stack.yml <nazwa stacka>
```

Usuwanie stacka

```
docker stack rm <nazwa stacka>
```
