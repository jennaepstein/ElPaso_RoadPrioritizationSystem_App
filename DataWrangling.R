library(dplyr)
library(tidyverse)
library(sf)
library(stringr)

City_bounds <- st_read("data/City_Boundaries.geojson")%>%
  mutate(City=CITY)

cityTitles <- str_to_title(City_bounds$City)

City_bounds <- City_bounds%>%
  mutate(City = cityTitles)

data <- st_read("filter_table.xlsx")%>%
  mutate(index = Field1,
         CBO_Name = Field2,
         Activities = Field3,
         City = Field4,
         HTC = Field5,
         Language = Field6)%>%
  dplyr::select(index, CBO_Name, Activities, City, HTC, Language)

data <- data[-1,]

allData <- left_join(City_bounds, data, by="City")%>%
  dplyr::select(index, CBO_Name, Activities, City, HTC, Language, geometry)%>%
  drop_na(index)

allData <- allData %>%
  st_as_sf()%>%
  st_transform(4326)

st_write(allData, "allData.geojson", driver="GeoJSON")
