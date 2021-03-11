from string import ascii_uppercase

def create_alphabet_lessons(user_id):
    lessons = []
    link = "https://www.startasl.com/american-sign-language-alphabet/"

    for letter in ascii_uppercase:
        lessons.append(
            {
                "userId": user_id,
                "module": "Alphabet",
                "title": "The letter {}".format(letter),
                "guide": link,
                "starsAchieved": 0,
                "totalStars": 3,
                "completed": False
            }
        )

    return lessons




if __name__ == "__main__":
    print(create_alphabet_lessons("123"))


