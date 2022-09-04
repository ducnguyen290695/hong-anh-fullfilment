import { gql } from '@apollo/client';

export const GET_CITIES = gql`
  query GetCities($ids: [ID!]) {
    city {
      list(ids: $ids) {
        id
        code
        name
      }
    }
  }
`;

export const GET_DISTRICTS_OF_CITY = gql`
  query GetDistrictsOfCity($cityID: ID!) {
    district {
      listOfCity(cityID: $cityID) {
        id
        code
        name
      }
    }
  }
`;

export const GET_WARDS_OF_DISTRICT = gql`
  query GetWardsOfDistrict($districtID: ID!) {
    ward {
      listOfDistrict(districtID: $districtID) {
        id
        code
        name
      }
    }
  }
`;

export const GET_BANKS = gql`
  query {
    bank {
      pagination {
        banks {
          id
          name
        }
      }
    }
  }
`;
