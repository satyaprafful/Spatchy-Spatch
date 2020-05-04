import csv

#Change this
input_file = 'serves_table_cleaned.tsv'
output_file = 'serves_ddl.sql'


with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	print(row_count)
	#Change this
	out_file.write("INSERT INTO Serves (rest_id, dish_id) VALUES ") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		rest_id = row[0]
		dish_id = row[1]
		if idx == row_count - 1:
			out_file.write("(" + rest_id + "," + dish_id + ")")
		else: 
			out_file.write("(" + rest_id + "," + dish_id + "), ")
	out_file.write(";")
	out_file.close()