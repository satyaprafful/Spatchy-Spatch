import csv

#Change this
input_file = 'rcategories.tsv'
output_file = 'rcategories.sql'


recipies_uploaded = set()

with open ('uploaded_recipes.csv') as file:
	reader = csv.reader(file, delimiter = ',')
	for idx, row in enumerate(reader): 
		if (idx == 0): 
			continue
		recipies_uploaded.add(row[0])
print(len(recipies_uploaded))


with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 

	added_set = set()
	
	#Change this
	out_file.write("INSERT INTO RCategories (rID, category) VALUES \n") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		if (idx == 0 or row[0] not in recipies_uploaded):
			print(row[0]) 
			continue
		if ((row[0],row[1]) in added_set):
			continue 
		rID = row[0]
		category = "\"" + row[1].replace("\"", "") + "\""
		if idx == row_count - 1:
			out_file.write("(" + rID + "," + category + ")")
		else: 
			out_file.write("(" + rID + "," + category + "), \n")
		added_set.add((row[0], row[1]))
	out_file.write(";")
	out_file.close()