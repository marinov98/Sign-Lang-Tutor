from api import app
import unittest

class SLTTesting(unittest.TestCase):

    def test_login_good(self):
        """ Assumes a user with test2@gmail.com exists """

        tester = app.test_client(self)
        response = tester.post(
            'api/auth/login',
            json={'email':'test2@gmail.com', 'password':"456"})
        self.assertTrue(response.status_code == 200)


    def test_login_bad(self):
        tester = app.test_client(self)

        # no data
        response = tester.post('api/auth/login')
        self.assertIn(b'No data found in request!', response.data)

        # no email
        response = tester.post('api/auth/login', json={'password':'fail'})
        self.assertIn(b'Blank field(s) detected!', response.data)

        # no password
        response = tester.post('api/auth/login', json={'email':'fail'})
        self.assertIn(b'Blank field(s) detected!', response.data)

        # wrong password
        response = tester.post('api/auth/login',
                               json={'email':'test2@gmail.com','password':'fail'})
        self.assertIn(b'Email and password do not match!', response.data)

        # wrong email
        response = tester.post('api/auth/login',
                               json={'email':'fail@gmail.com','password':'456'})
        self.assertIn(b'Email and password do not match!', response.data)

""" Todo: Need to be changed because they do not work
    def test_users_good(self):
        tester = app.test_client(self)

        # all users
        response = tester.get('/api/users/all', headers={'Content-Type': 'application/json',
                                                         'Authorization': 'Bearer {}'.format(access_token)})
        self.assertTrue(response.status_code == 200)

        # single
        response = tester.get('/api/users/single', headers={'Content-Type': 'application/json',
                                                         'Authorization': 'Bearer {}'.format(access_token)},
                                                   json={'email': 'test2@gmail.com'})
        self.assertTrue(response.status_code == 200)

        # single update
        response = tester.put('/api/users/update', headers={'Content-Type': 'application/json',
                                                         'Authorization': 'Bearer {}'.format(access_token)},
                                                   json={'email': 'test2@gmail.com',
                                                         'lessonsCompleted': 0,
                                                         'stars': 0,
                                                         'progress': 'Taken first steps'})
        self.assertTrue(response.status_code == 200)

    def test_users_bad(self):
        tester = app.test_client(self)

        # no token
        response = tester.get('/api/users/all')
        self.assertTrue(response.status_code == 401)

        response = tester.get('/api/users/single')
        self.assertTrue(response.status_code == 401)

        # bad token
        response = tester.get('/api/users/all', headers={'Authorization': 'Bearer badtoken'})
        self.assertTrue(response.status_code == 422)

        response = tester.get('/api/users/single', headers={'Authorization': 'Bearer badtoken'})
        self.assertTrue(response.status_code == 422)

        # bad single user
        response = tester.get('/api/users/single', headers={'Content-Type': 'application/json',
                                                         'Authorization': 'Bearer {}'.format(access_token)})
        self.assertTrue(response.status_code == 404)

        response = tester.get('/api/users/single', headers={'Content-Type': 'application/json',
                                                            'Authorization': 'Bearer {}'.format(access_token)},
                                                    json={'email': 'fail@fail.com'})
        self.assertTrue(response.status_code == 404)

        # bad update user
        response = tester.put('/api/users/update',
                              headers={'Content-Type': 'application/json',
                                       'Authorization': 'Bearer {}'.format(access_token)},
                              json={'email': 'fail@fail.com'})
        self.assertTrue(response.status_code == 404)

"""

if __name__ == '__main__':
    unittest.main()
