import csv

#Change this
input_file = 'idToDiet.tsv'
output_file = 'idToDiet.sql'

with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO IngrDiet (ingrID, isVegan, isDairyFree, isNutFree, isVegetarian, isGlutenFree) VALUES ") 
	file.seek(0)

	#Change this
	for idx,row in enumerate(reader):
		if idx == 0:
			continue
		ingrID = row[0]
		isVegan = row[1]
		isDairyFree = row[2]
		isNutFree = row[3]
		isVegetarian = row[4]
		isGlutenFree = row[5]
		if idx == row_count - 1:
			out_file.write("(" + ingrID + "," + isVegan + "," + isDairyFree + "," + isNutFree + "," + isVegetarian + "," + isGlutenFree + ")")
		else: 
			out_file.write("(" + ingrID + "," + isVegan + "," + isDairyFree + "," + isNutFree + "," + isVegetarian + "," + isGlutenFree + "), ")
	out_file.write(";")
	out_file.close()