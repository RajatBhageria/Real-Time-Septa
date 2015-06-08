Real Time Septa Tracking

========================
**NETS 150 UPENN Final Project**

**Authors:** Rajat Bhageria, Matt Chan, Colin Roberts

Overview
-----------

Here are the various steps and concepts we utilized in the creation of our project:

- We created a data scraper to turn the SEPTA map into actionable data, by
scraping the station list from each of the SEPTA schedules.
- After that, we used a map reduce algorithm to take that data and create an
adjacency list of the SEPTA map graph.
- Using the adjacency list of the SEPTA map, we created a shortest distance
route calculator using breadth first search.
- We used the SEPTA API, Google Maps API, created KML XML files of SEPTA
tracks, and created a real time map of the location of all the SEPTA trains.
- We used location data, the SEPTA API, and a JSONp scraper to tell the user
when the next train would arrive at the station they were at.
- Taking the SEPTA map graph adjacency list, we also used the page rank
algorithm to see which station(s) were the most influential in the system.

Project Relevancy
---------------
We went further than the project specifications, and used three elements from the list:
- *Graph and graph algorithms* – the SEPTA rail map is a very good example of both a directed and undirected graph, that has very relevant use cases. We used the concepts of an adjacency list, breadth first search, and PageRank in our application of the SEPTA rail map.
- *Document Search* – Integrating the SEPTA map into an app may seem easy at first, but unfortunately SEPTA’s API isn’t the best. We had to write a scraper and a map reduce algorithm to create the graph representation of the SEPTA rail map. Even trying to return the time until the next train required information retrieval techniques.
- *Physical Networks* – In the process of using SEPTA APIs, we had to learn how to use http GET requests, as well as how to get around the limitation of GET requests working only in the same domain (Same Origin Policy). This required a workaround using JSONp formatting that took a while to figure out, and helped us understand the physical network of the Internet better.

How to Install the App
---------------
In order to see a few of the features, including the breadth first search, the real time map, and the next train feature, one must run the app. We’ve made things really easy by deploying on Heroku as a web app. Simply point your phone’s browser towards https://realtimesepta.herokuapp.com. Allow the use of your location data, or the app features become pointless.
￼
Data Scraper
----------

![Philly Septa Map](http://www.philebrity.com/wp-content/uploads/2010/06/septa_0.jpg)

In order to turn the above SEPTA map into actionable data, we wrote a scraper using JSoup to scrape data from individual SEPTA schedules to create a text list of stations for every single one of SEPTA’s 13 rail lines. You can see the list of stations for each of the line in the excel file raillines.xlsx, and an integrated text version in raillinestext.txt. The code for the scraper that we used was simple, and we combined the schedules on the excel file.
￼

    Document doc = Jsoup.connect("http://www.septa.org/schedules/rail/w/AIR_1.html").get(); // Get links on page
    Elements links = doc.select("a[href]");
    for (Element link : links) {
      // Detect to see if this is a station as a bold hyperlink 
      if (link.parent().toString().contains("<b>")) {
        System.out.println(link.ownText());
      } 
    }
￼￼￼￼￼￼￼￼￼￼
MapReduce
---------------
Following that, we fed the text file into a MapReduce algorithm that we wrote in Java to turn all the individual 13 lists of stations into an adjacency list representing a graph of the entire system. The map part of the algorithm put all the nodes (stations) into a key value store (hashmap), with the keys being the nodes and the values being the stations that node is connected to. This would also check for ￼￼￼￼￼duplicates between rail line lists in order to integrate the 13 lists into one cohesive graph. The reduce part of the algorithm takes the key value store and outputs a JSON formatted adjacency list. You can find this in the GraphTools.java file. The outputted JSON formatted adjacency list can be found in the file StationJSON.txt.

Breadth First Search (App Feature: Trip Planner)
---------------
In order to find the most efficient path between two nodes on the SEPTA graph, we implemented a Breadth First Search algorithm using the JSON formatted adjacency list. The algorithm uses a queue and looks through the graph on a step-by-step basis until it finds the station that one is trying to go to. After that, it lists the stations that the user should go through to get to the correct station. This is integrated into the app as the Trip Planner tab. The source code can be found in controllers.js under realtimesepta/www/js.

The use case for this is extensive. If someone wants to figure out the shortest way to get from one part of Philly to another, this feature will be extremely helpful in navigating the somewhat confusing SEPTA map diagram.
