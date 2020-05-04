import csv


problem_rest = set()
problem_dish = set()

with open ('restaurant_table.tsv') as file: 
	reader = csv.reader(file, delimiter = '\t')
	last_id = 0
	for row in reader: 
		curr_id = int(row[0])
		if (last_id == curr_id):
			problem_rest.add(curr_id)
		last_id = curr_id
	with open ('restaurant_table_cleaned.tsv', 'w') as rest_file: 
		writer = csv.writer(rest_file, delimiter='\t')
		count = 0
		file.seek(0)
		for row in reader:
			if (int(row[0]) not in problem_rest):
				writer.writerow(row)
				count += 1
		print('rest'+' - '+ str(count))


with open ('dish_table.tsv') as file: 
	reader = csv.reader(file, delimiter = '\t')
	last_id = 0
	for row in reader: 
		curr_id = int(row[0])
		if (last_id == curr_id):
			problem_dish.add(curr_id)
		last_id = curr_id
	with open ('dish_table_cleaned.tsv', 'w') as rest_file:
		reader2 = csv.reader(file, delimiter = '\t') 
		writer = csv.writer(rest_file, delimiter='\t')
		count = 0
		file.seek(0)
		for row in reader2:
			if (int(row[0]) not in problem_dish):
				if (row[3] in 'N/A'):
					row[3] = '0'
				writer.writerow(row)
				count += 1
		print('dish'+' - '+ str(count))


#Write Tables 

with open ('serves_table.tsv') as file:
	serves_reader = csv.reader(file, delimiter = '\t')
	with open ('serves_table_cleaned.tsv', 'w') as rest_file:
		writer = csv.writer(rest_file, delimiter='\t')
		count_filter = 0
		count_og = 0
		for row in serves_reader:
			count_og += 1
			if ((int(row[0]) not in problem_rest) and (int(row[1]) not in problem_dish)):
				writer.writerow(row)
				count_filter += 1
		print('dish'+' - '+ str(count_og))
		print('dish'+' - '+ str(count_filter))



