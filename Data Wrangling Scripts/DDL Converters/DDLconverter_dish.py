import csv

#Change this
input_file = 'dish_table_cleaned.tsv'
output_file = 'dish_ddl.sql'


with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO Dish (dish_id, dish_category, dish_name, dish_price, dish_description) VALUES ") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		dish_id = row[0]
		dish_category = "\"" + row[1].replace("\"", "") + "\""
		dish_name = "\"" + row[2].replace("\"", "") + "\""
		dish_price = row[3]
		dish_description = "\"" + row[4].replace("\"", "") + "\""
		if idx == row_count - 1:
			out_file.write("(" + dish_id + "," + dish_category + "," + dish_name + "," + dish_price + "," + dish_description + ")")
		else: 
			out_file.write("(" + dish_id + "," + dish_category + "," + dish_name + "," + dish_price + "," + dish_description + "), ")
	out_file.write(";")
	out_file.close()