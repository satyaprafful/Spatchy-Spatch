import csv

#Change this
input_file = 'violations.tsv'
output_file = 'violations.sql'

rests_uploaded = set()
inspdates_uploaded = set()
written = set()

with open ('FINAL_RESTS.csv') as file:
	reader = csv.reader(file, delimiter = ',')
	for idx, row in enumerate(reader): 
		if (idx == 0): 
			continue
		rests_uploaded.add(row[0])

with open ('FINAL_INSPDATES.csv') as file:
	reader = csv.reader(file, delimiter = ',')
	for idx, row in enumerate(reader): 
		if (idx == 0): 
			continue
		inspdates_uploaded.add(row[0])


with open (input_file) as file: 
	reader = csv.reader(file, delimiter = '\t')
	row_count = sum(1 for row in reader)
	out_file = open(output_file, "w") 
	
	#Change this
	out_file.write("INSERT INTO Violations (rest_id, violationtype_id, violation_date, risk_category, violation_description) VALUES \n") 
	file.seek(0)

	#Change this 
	for idx,row in enumerate(reader):
		if idx == 0: 
			continue
		rest_id = str(int(row[0]) + 3000)
		if (rest_id not in rests_uploaded):
			continue
		violation_date = "\"" + row[1].replace("\"", "") + "\""
		if (row[1].replace("\"", "") not in inspdates_uploaded):
			continue 
		risk_category = "\"" + row[3].replace("\"", "") + "\""
		violationtype_id = row[2]
		if (violationtype_id == ''):
			violationtype_id = "0"
		violation_description = "\"" + row[4].replace("\"", "") + "\""

		out_row = "(" + rest_id + "," + violationtype_id + "," + violation_date + "," + risk_category + "," + violation_description + ")"
		if (out_row in written):
			continue
		written.add(out_row)
		if idx == row_count - 1:
			out_file.write("(" + rest_id + "," + violationtype_id + "," + violation_date + "," + risk_category + "," + violation_description + ")")
		else: 
			out_file.write("(" + rest_id + "," + violationtype_id + "," + violation_date + "," + risk_category + "," + violation_description + "), \n")
	out_file.write(";")
	out_file.close()