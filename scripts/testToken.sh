# client_id='387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com';
# client_secret='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';
client_id='387763281186-20mdm0pvsh03guh6g55av1cl2364869l.apps.googleusercontent.com';
client_secret='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';
# refresh_token='1//05qlPeJkZ0vkNCgYIARAAGAUSNwF-L9Ir8A54u702531UYWZaGHLevLh7o8ouMWcEDtURhHSDxBoOfmJyfn9yztEG_B5eS8ehkQk'
refresh_token='1//05zxb-MSiGpUhCgYIARAAGAUSNwF-L9IrFjjoc32SNY12Bz3zafbMNi9j06S71DeAUWeKN4FOXwnCxIyPiAr2eRlXnVVCQLB2GHM'
grant_type='refresh_token'
body="client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=${grant_type}"
echo ${body}
# curl --request POST --header "application/x-www-form-urlencoded" --data '${body}' https://oauth2.googleapis.com/token
curl --request POST --header "application/x-www-form-urlencoded" --data ${body} https://oauth2.googleapis.com/token
# curl --request POST --header "application/x-www-form-urlencoded" --data 'pwet' https://oauth2.googleapis.com/token