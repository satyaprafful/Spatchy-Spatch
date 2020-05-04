import csv

#Change this
input_file = 'ringredients.tsv'
output_file = 'ringredients.sql'

with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO RIngredients (rID, ingrID, unit, amount) VALUES \n") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		if idx == 0: 
			continue
		rID = row[0]
		ingrID = row[1]
		try:
			unit = "\"" + row[2].replace("\"", "") + "\""
		except IndexError:
			unit =  ''
		try:
			amount = row[3]
		except IndexError:
			amount =  '0'
		
		if len(unit) == 0: 
			unit =  ''
		if len(amount) == 0: 
			amount =  '0'

		if idx == row_count - 1:
			out_file.write("(" + rID + "," + ingrID + "," + unit + "," + amount +  ")")
		else: 
			out_file.write("(" + rID + "," + ingrID + "," + unit + "," + amount + "), \n")
	out_file.write(";")
	out_file.close()