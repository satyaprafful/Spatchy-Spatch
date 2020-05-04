# -*- coding: utf-8 -*-
import scrapy
import csv
import json
from scrapy import signals
from scrapy.xlib.pydispatch import dispatcher
import os

state_name = 'Pennsylvania'
data = {}
data[state_name] = {}
url = []

restaurant_table = []
serves_table = []
dish_table = []

class AlmenSpider(scrapy.Spider):
	name = 'almen'
	start_urls = url

	rest_id = 0 
	dish_id = 0

	def __init__(self):
		dispatcher.connect(self.spider_closed, signals.spider_closed)

		with open ('latest_ids.csv') as id_file: 
			id_reader = csv.reader(id_file)
			for val in id_reader: 
				self.rest_id = int(val[0])
				self.dish_id = int(val[1])

		with open(state_name + '.csv') as csvfile:
			for idx,item in enumerate(csvfile):
				if (idx == 0): 
					continue
				data[state_name][item.split(',')[0].strip('\n')] = []
				url.append(item.split(',')[1].strip('\n') + '-/')
	
	def parse(self, response):
		for href in response.css('li.restaurant-list-item .name a::attr(href)').extract():
			yield response.follow('https://www.allmenus.com' + href, self.parse_author)

	def parse_author(self, response):
		city_name = response.css('ul.s-list-inline-breadcrumb li a::text').extract()[1].strip()
		rest_name = response.css('div.restaurant-summary h1 span::text').extract_first().strip()

		rest_address = response.css('a.menu-address::text').extract_first()
		if rest_address is None:
			rest_address = 'N/A'
		else:
			rest_address = rest_address.strip()

		rest_number = response.css('a.menu-phone-number::text').extract_first()
		if rest_number is None:
			rest_number = 'N/A'
		else:
			rest_number = rest_number.strip()

		rest_cuisine = response.css('li.cuisine a::text').extract()
		if not rest_cuisine:
			rest_cuisine = 'N/A'

		rest_website = response.css('a.menu-link::attr(href)').extract_first()
		if rest_website is None:
			rest_website = 'N/A'
		else:
			rest_website = rest_website.strip()

		rest_price = response.css('span.active-dollar::text').extract_first()
		if rest_price is None:
			rest_price = 'N/A'
		else:
			rest_price = str(len(rest_price)) + '/5'

		menu = {}
		for item in response.css('li.menu-category'):
			
			category_name = item.css('div.category-name::text').extract_first()
			menu[category_name] = []
			
			for dish in item.css('li.menu-items'):
				
				dish_name = dish.css('span.item-title::text').extract_first()
				
				dish_price = dish.css('span.item-price::text').extract_first()
				if dish_price is None or dish_price is '':
					dish_price = 'N/A'
				else:
					dish_price = dish_price.strip('\n').strip('\r').strip()
					dish_price = dish_price.translate({ord(c): None for c in '$+'})
					if dish_price is None or dish_price is '':
						dish_price = 'N/A'
				
				dish_description = dish.css('p.description::text').extract_first()
				if dish_description is None or dish_description is '':
					dish_description = 'N/A'
				else:
					dish_description = dish_description.strip('\n').strip('\r').strip()

				menu[category_name].append([dish_name, dish_price, dish_description])
		
		if not menu:
			menu = 'N/A'
		
		try:

			#Restaurant (rest_id, rest_name, rest_address, rest_cuisine, rest_price, rest_city, rest_state) [To add ratings]
			#Serves (rest_id, dish_id) *
			#Dish (dishID, dish_category, dish_name, dish_price, dish_description)  *

			restaurant_row = []
			restaurant_row.append(self.rest_id)
			restaurant_row.append(rest_name)
			restaurant_row.append(rest_address)
			restaurant_row.append(rest_cuisine)
			restaurant_row.append(rest_website)
			restaurant_row.append(state_name)
			restaurant_row.append(city_name)
			restaurant_table.append(restaurant_row)

			for category_name in menu:
				for dish_info in menu[category_name]:
					dish_row = [self.dish_id, category_name] + dish_info
					dish_table.append(dish_row)
					serves_table.append([self.rest_id, self.dish_id])
					self.dish_id += 1
			self.rest_id += 1
#			data[state_name][city_name].append({'Restaurant Name':rest_name, 'Restaurant Address':rest_address, 'Restaurant Phone Number':rest_number, 'Restaurant Cuisine':rest_cuisine, 'Restaurant Website':rest_website, 'Restaurant Price':rest_price, 'Restaurant Menu':menu})

		except:
			print("failed")
			pass
		
		pass

	def spider_closed(self, spider):
		print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
		#Writing Latest IDs 
		with open ('latest_ids.csv' ,'w') as id_file:
			writer = csv.writer(id_file, delimiter=',')
			writer.writerow([str(self.rest_id), str(self.dish_id)])

		#Write Tables 
		with open ('restaurant_table.tsv', 'a') as rest_file: 
			writer = csv.writer(rest_file, delimiter='\t')
			for row in restaurant_table: 
				writer.writerow(row)

		with open ('serves_table.tsv', 'a') as serves_file: 
			writer = csv.writer(serves_file, delimiter='\t')
			for row in serves_table: 
				writer.writerow(row)

		with open ('dish_table.tsv', 'a') as dish_file: 
			writer = csv.writer(dish_file, delimiter='\t')
			for row in dish_table: 
				writer.writerow(row)

		print(self.rest_id, self.dish_id)		
		print("done")
		print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')