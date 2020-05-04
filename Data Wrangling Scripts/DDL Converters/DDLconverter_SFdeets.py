import csv

input_file_business = 'business.tsv'
output_file = 'business.sql'

seen_set = set()

with open (input_file_business) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w")
	
	#Change this
	out_file.write("INSERT INTO Restaurant (rest_id, rest_name, rest_address, rest_cuisine, rest_website, rest_state, rest_city) VALUES \n") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		if (idx == 0): 
			continue
		rest_id = str(int(row[0]) + 3000)
		if (rest_id in seen_set):
			continue 
		seen_set.add(rest_id)
		rest_name = "\"" + row[1].replace("\"", "") + "\""
		rest_address = "\"" + row[2].replace("\"", "") + " " + row[4] + "\""
		rest_cuisine = "\"N/A\""
		rest_city = "\"San Francisco\""
		rest_state = "\"California\""
		rest_website = "\"www.google.com/search?q=" + row[1].replace("\"", "") + "%20" + row[2].replace("\"", "") + " " + row[4] + "%20" + "San Francisco" + "\""
		if idx == row_count - 1:
			break
			out_file.write("(" + rest_id + "," + rest_name + "," + rest_address + "," + rest_cuisine + "," + rest_website + "," + rest_state + "," + rest_city + ");")
		else: 
			out_file.write("(" + rest_id + "," + rest_name + "," + rest_address + "," + rest_cuisine + "," + rest_website + "," + rest_state + "," + rest_city + "), \n")			
	out_file.write(";")
	out_file.close()