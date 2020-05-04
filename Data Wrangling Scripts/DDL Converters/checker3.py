import csv

with open ('ringredients.sql') as file:
	reader = csv.reader(file, delimiter = ',')
	total_set = set([i for i in range(0, 204)])
	count_set = set()
	for idx, row in enumerate(reader): 
		if (idx == 0): 
			continue
		count_set.add(int(row[1]))
	print((count_set.difference(total_set)))