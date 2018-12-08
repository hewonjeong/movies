import getLinks from '../getLinks'
import { document } from './samples'

describe('getLinks()', () => {
  it('basic', () => {
    const expected = [
      '/m/creed_ii',
      '/m/ralph_breaks_the_internet',
      '/m/mission_impossible_fallout',
      '/m/aquaman_2018',
      '/m/bumblebee',
      '/m/mary_poppins_returns',
      '/m/welcome_to_marwen',
      '/m/second_act_2018',
      '/m/spider_man_into_the_spider_verse',
      '/m/the_mule_2018',
      '/m/the_grinch',
      '/m/mortal_engines',
      '/m/bohemian_rhapsody',
      '/m/instant_family',
      '/m/fantastic_beasts_the_crimes_of_grindelwald',
      '/m/green_book',
      '/m/vice_2018',
      '/m/holmes_and_watson_2018',
      '/m/destroyer',
      '/m/on_the_basis_of_sex',
      '/m/stan_and_ollie',
      '/m/the_predator',
      '/m/bad_times_at_the_el_royale',
      '/m/the_house_with_a_clock_in_its_walls',
      '/m/mid90s',
      '/m/fahrenheit_119',
      '/m/venom_2018',
      '/m/a_simple_favor',
      '/m/equalizer_2',
      '/m/marie_curie_the_courage_of_knowledge_2017',
      '/m/roma_2018',
    ]
    expect(getLinks(document)).toEqual(expected)
  })
})
