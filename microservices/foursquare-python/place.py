class Place:
    def __init__(self, id, provider, name, description='', location=None, address='', uri=''):
        self.id = id
        self.provider = provider
        self.name = name
        self.description = description
        self.location = location
        self.address = address
        self.uri = uri

    def toDict(self):
        return self.__dict__
