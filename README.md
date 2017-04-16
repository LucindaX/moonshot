# Moonshot
Prototype for Moonshot AQI data exposure via API

##Installation

Easy setup with docker , step into current directory where docker-compose.yml is located. 
Make sure you have docker-compose installed .

```
$ docker-compose up
```
The server will be exposed on `localhost:3000`

##Usage

The DB will be filled with dummy data for Amsterdam for the current month you're running it in .

The server exposes the API as follows :

```
/api/feed/:city?date=x&type=x
```
`:city` : For whatever city data you're looking for , if city not in our current DB , a not found message relaying so will be sent back .
`type=` : The type of data for plotting returned , whether it's for a day , or for an entire weel. So the following option work `type=day` or `type=week` .
`date=` : The date for which the data will be searched for . In case of `type=day` will look for that date in the corresponding citys timezone and return corresponding data . In case of `type=week` return the data for the entire week that date falls in .

Example :

```
127.0.0.1:3000/api/feed/amsterdam?date=2017-04-10&type=day
```

```
{  
   "date":"2017-04-10",
   "utcOffset":"+02:00",
   "data":[  
      {  
         "aqi":125.90,
         "time":"2017-04-09T22:00:00.000Z"
      },
      {  
         "aqi":92.92,
         "time":"2017-04-09T23:00:00.000Z"
      },
      {  
         "aqi":101.35,
         "time":"2017-04-10T00:00:00.000Z"
      },
      {  
         "aqi":129.19,
         "time":"2017-04-10T01:00:00.000Z"
      },
      {  
         "aqi":146.45,
         "time":"2017-04-10T02:00:00.000Z"
      },
      {  
         "aqi":114.76,
         "time":"2017-04-10T03:00:00.000Z"
      },
      {  
         "aqi":152.25,
         "time":"2017-04-10T04:00:00.000Z"
      },
      {  
         "aqi":86.28,
         "time":"2017-04-10T05:00:00.000Z"
      },
      {  
         "aqi":102.71,
         "time":"2017-04-10T06:00:00.000Z"
      },
      {  
         "aqi":97.82,
         "time":"2017-04-10T07:00:00.000Z"
      },
      {  
         "aqi":95.39,
         "time":"2017-04-10T08:00:00.000Z"
      },
      {  
         "aqi":146.53,
         "time":"2017-04-10T09:00:00.000Z"
      },
      {  
         "aqi":111.83,
         "time":"2017-04-10T10:00:00.000Z"
      },
      {  
         "aqi":92.99,
         "time":"2017-04-10T11:00:00.000Z"
      },
      {  
         "aqi":81.45,
         "time":"2017-04-10T12:00:00.000Z"
      },
      {  
         "aqi":116.87,
         "time":"2017-04-10T13:00:00.000Z"
      },
      {  
         "aqi":99.04,
         "time":"2017-04-10T14:00:00.000Z"
      },
      {  
         "aqi":99.99,
         "time":"2017-04-10T15:00:00.000Z"
      },
      {  
         "aqi":91.73,
         "time":"2017-04-10T16:00:00.000Z"
      },
      {  
         "aqi":150.92,
         "time":"2017-04-10T17:00:00.000Z"
      },
      {  
         "aqi":148.49,
         "time":"2017-04-10T18:00:00.000Z"
      },
      {  
         "aqi":105.01,
         "time":"2017-04-10T19:00:00.000Z"
      },
      {  
         "aqi":88.18,
         "time":"2017-04-10T20:00:00.000Z"
      },
      {  
         "aqi":114.09,
         "time":"2017-04-10T21:00:00.000Z"
      }
   ]
}

```

The data returned is a hour by hour value of the AQI . A utcOffset is sent for conversion to polled city time , as all these values are in UTC .

```
127.0.0.1:3000/api/feed/amsterdam?type=week&date=2017-04-10
```

```
{  
   "date":"2017-04-10",
   "utcOffset":"+02:00",
   "week":[  
      {  
         "date":"2017-04-08T22:00:00.000Z",
         "aqi":113.82
      },
      {  
         "date":"2017-04-09T22:00:00.000Z",
         "aqi":112.18
      },
      {  
         "date":"2017-04-10T22:00:00.000Z",
         "aqi":113.16
      },
      {  
         "date":"2017-04-11T22:00:00.000Z",
         "aqi":115.42
      },
      {  
         "date":"2017-04-12T22:00:00.000Z",
         "aqi":118.1
      },
      {  
         "date":"2017-04-13T22:00:00.000Z",
         "aqi":114.17
      },
      {  
         "date":"2017-04-14T22:00:00.000Z",
         "aqi":111.99
      }
   ]
}
```

In this case of week data , an average of the days AQI values is calculated and returned as the value for the day , so you have a week of dates with corresponding readings .

## Notes

The data in the DB is all dummy data . I've written a script to collect data for cities in the DB on an hourly basis from the aqicn api and save to DB , as this is what would be done in concept . To run that script `npm run collect-data` . The script will run in the background and every hour will poll the external API for current data of the cities that are present in the DB and save them accordingly , and logs will be sent to cron.log .

You can download the docker-compose.yml and running it with the repo to expose the api , the image supplied is already uploaded to the docker registery and depends on another mongodb official image to run .
