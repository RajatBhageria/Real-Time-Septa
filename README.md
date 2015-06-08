==Nets 150 Final Project: Real Time Septa==
Rajat Bhageria 
Matt Chan 
Colin Roberts
Overview

Here are the various steps and concepts we utilized in the creation of our project:
-------------------------------------------------------------------------
• We created a data scraper to turn the SEPTA map into actionable data, by
scraping the station list from each of the SEPTA schedules.
• After that, we used a map reduce algorithm to take that data and create an
adjacency list of the SEPTA map graph.
• Using the adjacency list of the SEPTA map, we created a shortest distance
route calculator using breadth first search.
• We used the SEPTA API, Google Maps API, created KML XML files of SEPTA
tracks, and created a real time map of the location of all the SEPTA trains.
• We used location data, the SEPTA API, and a JSONp scraper to tell the user
when the next train would arrive at the station they were at.
• Taking the SEPTA map graph adjacency list, we also used the page rank
algorithm to see which station(s) were the most influential in the system.

==Project Relevancy==
We went further than the project specifications, and used three elements from the list:
• Graph and graph algorithms – the SEPTA rail map is a very good example of both a directed and undirected graph, that has very relevant use cases. We used the concepts of an adjacency list, breadth first search, and PageRank in our application of the SEPTA rail map.
• Document Search – Integrating the SEPTA map into an app may seem easy at first, but unfortunately SEPTA’s API isn’t the best. We had to write a scraper and a map reduce algorithm to create the graph representation of the SEPTA rail map. Even trying to return the time until the next train required information retrieval techniques.
• Physical Networks – In the process of using SEPTA APIs, we had to learn how to use http GET requests, as well as how to get around the limitation of GET requests working only in the same domain (Same Origin Policy). This required a workaround using JSONp formatting that took a while to figure out, and helped us understand the physical network of the Internet better.
￼￼￼￼￼￼￼￼￼￼
