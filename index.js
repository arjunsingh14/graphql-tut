const { v1: uuid } = require("uuid");
const { ApolloServer, UserInputError, gql } = require("apollo-server");

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefs = gql`
  enum yesNo {
      YES
      NO
  }
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons (phone: yesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;
//Define our queries and how they store information
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
        if (!args.phone) return persons
        return persons.filter((person) => args.phone === 'YES' ? person.phone : !person.phone)
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
  //if not put up in resolvers, Person is defined by apollo's default
  //resolver which just take the root properties defined in typedefs and assigns them
  //to customise define new Person property and use root to access elements
  
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },

  /**
   * Mutations work a like post/patch requests, use them to add/edit new
   * person to the db
   */
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons = persons.concat(person);
      return person;
    },
  },
  editNumber: (root, args) => {
      const person = persons.find((p) => args.name === p.name)
      if (!person){
          return null
      }
      const updatePerson = {...person, phone:args.phone}
      persons.map((p) => p.name === args.name ? updatePerson : p)
      return updatePerson
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
