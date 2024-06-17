**Goal:** Our project aimed to enable users to compare trends in the popularity of video games among players on the Steam platform and viewers on the Twitch platform. While data sets for each service are available individually, there is no combined comparison of these statistics.

![image](https://github.com/ultron682/docker-asp.net-react_ZestawienieDanychNaTematWplywuPlatformyTwitchNaPopularnoscGierSteam/assets/52131708/f47f7697-d991-4d6b-a091-04d58b76e7bf)

![image](https://github.com/ultron682/docker-asp.net-react_ZestawienieDanychNaTematWplywuPlatformyTwitchNaPopularnoscGierSteam/assets/52131708/4ea7b976-71df-4709-97fa-efca9bde7474)

![image](https://github.com/ultron682/docker-asp.net-react_ZestawienieDanychNaTematWplywuPlatformyTwitchNaPopularnoscGierSteam/assets/52131708/fe3c3f2b-5ee3-4516-96dc-986c1b0c27ed)

![image](https://github.com/ultron682/docker-asp.net-react_ZestawienieDanychNaTematWplywuPlatformyTwitchNaPopularnoscGierSteam/assets/52131708/c1564aef-2f72-415c-9265-f07592b54fe9)

![image](https://github.com/ultron682/docker-asp.net-react_ZestawienieDanychNaTematWplywuPlatformyTwitchNaPopularnoscGierSteam/assets/52131708/cc2ab5c4-a6f8-4d72-aa62-b1fb3dbbb18f)

**Data Sources:**

Steam:
Dataset: Steam Games Dataset: Player count history, Price history, and data about games (Mendeley Data, CC BY 4.0)
Contents: This dataset includes player count history, game titles, genres, and publishers. It covers 2000 games on Steam from December 14, 2017, to August 12, 2020. The data is divided into multiple .csv files named by Steam game IDs. Each file contains date-specific player count data.

Twitch:

Top games on Twitch 2016 - 2023 (kaggle.com, CC0)
Contents: This dataset provides historical data on the top 200 games each month on Twitch from January 2016 to October 2023. Each record includes the year, month, game ranking, game name, and average number of viewers per month.
Application: By combining these two datasets, our application allows users to compare the popularity of games and their genres among players and viewers through various types of charts and offers filtering options.



## Docker Compose
**Build images**
```
docker-compose up --build
```

## Docker Swarm
**Deploy**
```
docker swarm init
docker-compose -f docker-compose_for_stack.yml build
docker stack deploy -c docker-stack.yml <nazwa stacka>
```

**After all to be removed:**
```
docker stack rm <nazwa stacka>
```
