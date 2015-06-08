Real Time Septa | NETS150 UPenn Final Project

Description: An app that creates a virtual graph representation of the SEPTA system (Philadelphia Transit) and combines it with the SEPTA API to provide useful tools for travelers. 

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
algorithm to see which station(s) were the most influential in the system. (


Categories Used: 
• Graph and Graph Algorithms
• Document Search
• Physical Networks

SEE THE USER MANUAL FOR INSTRUCTIONS


