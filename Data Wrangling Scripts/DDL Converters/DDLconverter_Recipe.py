import csv




#Change this
input_file = 'recipe.tsv'
output_file = 'recipe.sql'

with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO Recipe (rID, title, recipe_descr, rating, ingr_descr, directions, sodium, calories, protein, fat) VALUES \n") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		if idx == 0: 
			continue
		rID = row[0]
		title = "\"" + row[1].replace("\"", "") + "\""
		recipe_descr = "\"" + row[2].replace("\"", "") + "\""
		rating = row[3]
		ingr_descr = "\"" + row[4].replace("\"", "") + "\""
		directions = "\"" + row[5].replace("\"", "") + "\""
		try:
			sodium =  row[6]
		except IndexError:
			sodium =  '0'
		try:
			calories =  row[7]
		except IndexError:
			calories =  '0'
		try:
			protein = row[8]
		except IndexError:
			protein = '0'
		try:
			fat = row[9]
		except IndexError:
			fat = '0'

		if len(recipe_descr) == 0: 
			recipe_descr =  ''
		if len(rating) == 0: 
			rating =  '0'
		if len(ingr_descr) == 0: 
			ingr_descr =  ''
		if len(directions) == 0: 
			directions =  ''
		if len(sodium) == 0: 
			sodium =  '0'
		if len(calories) == 0: 
			calories =  '0'
		if len(protein) == 0: 
			protein =  '0'
		if len(fat) == 0: 
			fat =  '0'

		if idx == row_count -  1:
			out_file.write("(" + rID + "," + title + "," + recipe_descr + "," + rating + "," + ingr_descr + "," + directions + "," + sodium + "," + calories + "," + protein + "," + fat + ")")
			break
		else: 
			out_file.write("(" + rID + "," + title + "," + recipe_descr + "," + rating + "," + ingr_descr + "," + directions + "," + sodium + "," + calories + "," + protein + "," + fat + "), \n")

	out_file.write(";")
	out_file.close()