import csv

#Change this
input_file = 'restaurant_table_cleaned.tsv'
output_file = 'restauraunt_ddl.sql'


with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO Restaurant (rest_id, rest_name, rest_address, rest_cuisine, rest_website, rest_state, rest_city) VALUES ") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		rest_id = row[0]
		rest_name = "\"" + row[1].replace("\"", "") + "\""
		rest_address = "\"" + row[2].replace("\"", "") + "\""
		rest_cuisine = "\"" + row[3].replace("\"", "") + "\""
		rest_website = "\"" + row[4].replace("\"", "") + "\""
		rest_state = "\"" + row[5].replace("\"", "") + "\""
		rest_city = "\"" + row[6].replace("\"", "") + "\""
		if idx == row_count -1:
			out_file.write("(" + rest_id + "," + rest_name + "," + rest_address + "," + rest_cuisine + "," + rest_website + "," + rest_state + "," + rest_city + ")")
		else: 
			out_file.write("(" + rest_id + "," + rest_name + "," + rest_address + "," + rest_cuisine + "," + rest_website + "," + rest_state + "," + rest_city + "),")			
	out_file.write(";")
	out_file.close()