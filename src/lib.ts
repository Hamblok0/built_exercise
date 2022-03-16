import { MovieCode } from "./Movie";
import { Statement, Type } from "./Statement";
const billing: any = require("./data/billing.json");

const calculateFee = (code: any, days: number): number => {
    const rentalType = billing[code];
    let total = rentalType.max ? rentalType.cost : rentalType.cost * days;
    let lateFees = (days - rentalType.max) * rentalType.late;
    return lateFees > 0 ? total + lateFees : total;
    
}
const txtStatement = (statement: Statement): string => {
  let breakdown = ``;
  let output = ``;
  for (let i of statement.breakdown) {
    breakdown += `\t${i.movie}\t${i.amount}\n`;
  }
  output =
    `Rental Record for ${statement.name}\n` +
    breakdown +
    `Amount owed is ${statement.total}\n` +
    `You earned ${statement.points} frequent renter points`;
  return output;
};

const htmlStatement = (statement: Statement): string => {
  let breakdown = ``;
  let output = ``;
  for (let i of statement.breakdown) {
    breakdown += `    <li>${i.movie} - ${i.amount}</li>\n`;
  }
  output =
    `<h1>Rental Record for <em>${statement.name}</em></h1>\n` +
    `<ul>\n` +
    breakdown +
    `</ul>\n` +
    `<p>Amount owed is <em>${statement.total}</em></p>\n` +
    `<p>You earned <em>${statement.points}</em> frequent renter points</p>`;
  return output;
};

export const processStatement = (customer: any, movies: any, type: string): string => {
  let totalAmount = 0;
  let frequentRenterPoints = customer["frequentRenterPoints"];
  let breakdown = [];
  for (let r of customer.rentals) {
    let movie = movies[r.movieID];
    let thisAmount = calculateFee(movie.code, r.days);

    frequentRenterPoints++;
    if (movie.code === MovieCode.NEW && r.days > 2) frequentRenterPoints++;

    breakdown.push({
      movie: movie.title,
      amount: thisAmount,
    });

    totalAmount += thisAmount;
  }
  const statement: Statement = {
    name: customer.name,
    breakdown,
    total: totalAmount,
    points: frequentRenterPoints,
  };

  switch (type) {
    case Type.TEXT:
      return txtStatement(statement);
    case Type.HTML:
      return htmlStatement(statement);
    default:
      return `ERROR: Type ${type} is not a supported output format`;
  }
};
