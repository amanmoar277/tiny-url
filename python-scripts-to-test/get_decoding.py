import csv
import requests
import datetime
import os
import json
import logging

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(format=FORMAT)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

csvHeaders = [ 'tinyURL', 'statusCode' ]
resdCsvHeaders = [ 'originalURL', 'tinyURL' ]

def main():
    file = open(os.getcwd() + '/python-scripts-to-test/generated-data/encoded_data.csv')
	
    data = []
    data = csv.DictReader(file, fieldnames = resdCsvHeaders)
    output_file_name = "python-scripts-to-test/generated-data/decode_API_status.csv"

    header_detail = {'content-type': 'application/json'}
    errored_value = []
    line_count = 0
    for urlObj in data:
        line_count += 1
        if line_count == 1:
            continue

        if "tinyURL" in urlObj:
            response = requests.get(urlObj["tinyURL"], headers=header_detail)
            try:
                logger.info(urlObj["tinyURL"] + ' -> ' + str(response.status_code))
                response_obj = {
                    "tinyURL": urlObj["tinyURL"]
                }
                if response.status_code:
                    response_obj['statusCode'] = response.status_code
                list_op = []
                list_op.append(response_obj)
                with open(output_file_name, 'a') as output_file:
                    dict_writer = csv.DictWriter(output_file, csvHeaders)
                    if output_file.tell() == 0:
                        dict_writer.writeheader()
                    dict_writer.writerows(list_op)
            
            except Exception as e:
                logger.error(e)
                errored_value.append(urlObj)

if __name__ == '__main__':
	start_time = datetime.datetime.now()
	main()

	run_time = datetime.datetime.now() - start_time

	print(f'Run time taken -------------------------------------{run_time}')