from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import json
import os

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = os.environ['sheet_id']

def get_sub_sheet(SAMPLE_RANGE_NAME):
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')

    return sanitize_values(values)

    # else:
    #     for row in values:
    #         print(':'.join(row))
    # print('Name, Major:')
    # for row in values:
    #     # Print columns A and E, which correspond to indices 0 and 4.
    #     print('%s, %s' % (row[0], row[4]))


def sanitize_values(values):
    max_len = len(values[0])
    for row in values[1:]:
        while(len(row) < max_len):
            row.append('')
    return values


def create_key_dict(row):
    ret = {}
    for key, index in enumerate(row):
        ret[index] = key

    # print(ret)

    return ret


def create_members_json():
    values = get_sub_sheet('members!A1:R')
    access_dict = create_key_dict(values[0])

    all_member_data = []

    for member_data in values[1:]:
        new_data = {}

        # display_on_website field
        new_data['display_on_website'] = (
            member_data[access_dict['DisplayOnWebsite']] == 'Y')

        # name field
        new_data['name'] = member_data[access_dict['Name']]

        # hostel field
        new_data['hostel'] = member_data[access_dict['Hostel']]

        # gender field
        new_data['gender'] = member_data[access_dict['Gender']]

        # join_year field
        new_data['join_year'] = member_data[access_dict['Join_year']]

        # grad_year field
        new_data['grad_year'] = member_data[access_dict['Grad_year']]

        # entry_no field
        new_data['entry_no'] = member_data[access_dict['Entry Number']]

        # phone_no field
        new_data['phone_no'] = member_data[access_dict['Phone Number']]

        # birth_date field
        new_data['birth_date'] = member_data[access_dict['Birth Date']]

        # email field
        new_data['email'] = member_data[access_dict['Primary Email Address']]

        # hometown field
        new_data['hometown'] = member_data[access_dict['Home Town (Delhi/Other)']]

        # interests field
        new_data['interests'] = member_data[access_dict['Interests']]

        # specialization field
        new_data['specialization'] = member_data[access_dict['Specialization']]

        # category field
        new_data['category'] = member_data[access_dict['Category']]

        # url field
        new_data['url'] = {}

        # picture_url subfield
        new_data['url']['picture_url'] = member_data[access_dict['Picture URL']]

        # fb_url subfield
        new_data['url']['fb_url'] = member_data[access_dict['FB URL']]

        # github_url subfield
        new_data['url']['github_url'] = member_data[access_dict['Github URL']]

        # intro field
        new_data['intro'] = member_data[access_dict['Description']]

        all_member_data.append(new_data)

    with open('members.json', 'w') as outfile:
        json.dump(all_member_data, outfile, indent=4, sort_keys=True)


def create_projects_json():
    values = get_sub_sheet('projects!A1:M')
    access_dict = create_key_dict(values[0])

    all_data = []

    for row in values[1:]:
        new_data = {}

        # name field
        new_data['name'] = row[access_dict['Name']]

        # description field
        new_data['description'] = row[access_dict['Description']]

        # showcase field (bool)
        new_data['showcase'] = (row[access_dict['Showcase']] == 'Y')

        # origin field
        new_data['origin'] = row[access_dict['Issuing Authority / Contact']]

        # origin_contact field
        new_data['origin_contact'] = row[access_dict['Email ID / Number of Contact']]

        # start_date field
        new_data['start_date'] = row[access_dict['Date of Issue (dd-mm-yyyy)']]

        # end_date field
        new_data['end_date'] = row[access_dict['Date of Closure (If not Active)']]

        # members field (array)
        new_data['members'] = row[access_dict['Working Team']].split(',')

        # requirements field
        new_data['requirements'] = row[access_dict['Requirement if still Active']]

        # perks field
        new_data['perks'] = row[access_dict['Rewards/Benefit']]

        # display_on_website field (bool)
        new_data['display_on_website'] = (
            row[access_dict['DisplayOnWebsite (Y/N)']] == 'Y')

        # labels field (array)
        new_data['labels'] = row[access_dict['labels']].split(',')

        # url field
        new_data['url'] = {}

        # photo_url subfield
        new_data['url']['photo_url'] = row[access_dict['Image URL']]

        # # repository_url subfield
        # new_data['url']['repository_url'] = row[access_dict['Repository URL']]

        # # project_url subfield
        # new_data['url']['project_url'] = row[access_dict['Project URL']]

        all_data.append(new_data)

    with open('projects.json', 'w') as outfile:
        json.dump(all_data, outfile, indent=4, sort_keys=True)


def create_resources_json():
    values = get_sub_sheet('resources!A1:J')
    access_dict = create_key_dict(values[0])

    all_data = []

    for row in values[1:]:
        new_data = {}

        # internal_name field
        new_data['internal_name'] = row[access_dict['internal_name']]

        # directory_year field
        new_data['directory_year'] = row[access_dict['directory_year']]

        # subdirectory field
        new_data['subdirectory'] = row[access_dict['sub_directory']]

        # name field
        new_data['name'] = row[access_dict['name']]

        # archive field (bool)
        new_data['archive'] = (row[access_dict['archive']] == 'Y')
        
        # display_on_website field (bool)
        new_data['display_on_website'] = (row[access_dict['Display On Website']] == 'Y')

        # description field
        new_data['description'] = row[access_dict['description']]

        # url field
        new_data['url'] = row[access_dict['URL']]

        # date_of_creation fiel
        new_data['date_of_creation'] = row[access_dict['Date Of Creation']]

        # new field(bool)
        new_data['new'] = (row[access_dict['New']] == 'Y')

        all_data.append(new_data)

    with open('resources.json', 'w') as outfile:
        json.dump(all_data, outfile, indent=4, sort_keys=True)


def create_events_json():
    values = get_sub_sheet('events!A1:F')
    access_dict = create_key_dict(values[0])

    all_data = []

    for row in values[1:]:
        new_data = {}

        # name field
        new_data['name'] = row[access_dict['Name']]

        # start_date field
        new_data['start_date'] = row[access_dict['Date']]

        # description field
        new_data['description'] = row[access_dict['Description']]

        # display_on_website field
        new_data['display_on_website'] = (
            row[access_dict['DisplayOnWebsite']] == 'Y')

        # url field (bool)
        new_data['url'] = row[access_dict['PhotoURL']]

        # embed_code field
        new_data['embed_code'] = ''

        all_data.append(new_data)

    with open('events.json', 'w') as outfile:
        json.dump(all_data, outfile, indent=4, sort_keys=True)


if __name__ == '__main__':
    create_members_json()
    create_projects_json()
    create_resources_json()
    create_events_json()
