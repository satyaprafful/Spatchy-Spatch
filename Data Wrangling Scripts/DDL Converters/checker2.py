import csv




with open ('uploaded_dishes.tsv') as file:
	udishes_reader = csv.reader(file, delimiter = '\t')
	prosent_dish = set()
	for row in udishes_reader:
		prosent_dish.add(int(row[0]))
	with open ('serves_table_final.tsv', 'w') as rest_file:
		with open ('serves_table_cleaned.tsv') as serves_file:
			serves_reader = csv.reader(serves_file, delimiter = '\t')
			writer = csv.writer(rest_file, delimiter='\t')
			count_filter = 0
			count_og = 0
			for row in serves_reader:
				count_og += 1
				if (int(row[1]) in prosent_dish):
					writer.writerow(row)
					count_filter += 1
			print('serves'+' - '+ str(count_og))
			print('Serves'+' - '+ str(count_filter))




