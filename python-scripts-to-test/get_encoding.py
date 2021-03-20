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

csvHeaders = [ 'originalURL', 'tinyURL' ]

SERVICE_BASE_URL = 'http://localhost:5000/'
API_ENDPOINT = SERVICE_BASE_URL + 'api/encode'

def main():
    output_file_name = 'generated-data/encoded_data.csv'
    input_data_file = open(os.getcwd() + '/generated-data/raw_urls_payload.json')
    json_data = json.load(input_data_file)

    data = json_data["values"]

    header_detail = {'content-type': 'application/json'}
    errored_value = []
    for urlObj in data:
        # print(urlObj)
        response = requests.post(API_ENDPOINT, json=urlObj, headers=header_detail)

        try:
            logger.info(response.status_code)
            if response.status_code == 200:
                # logger.info(response.json())

                encoding = response.json()
                response_obj = {
                    "originalURL": urlObj["url"]
                }

                print(encoding["url"])
                if 'url' in encoding:
                    response_obj["tinyURL"] = encoding["url"].replace('https://tiny-url-service.com', 'http://localhost:5000/api')

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