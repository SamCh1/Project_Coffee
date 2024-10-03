const pagination = require('../helpers/pagination.helper');
const {describe, it} = require("node:test");
const  assert = require("node:assert")


describe('pagination function', () => {
    it('should return pagination object with default values if page is not specified', () => {
      const limitItems = 10;
      const query = {};
      const count = 100;

      const actual = pagination(limitItems, query, count);
      const expected = 10;
      // assert.strictEqual(actual, expected);
      // assert(result.currentPage).toEqual(1);
      // assert(result.limitItem).toEqual(limitItems);
      // assert(result.skip).toEqual(0);
      // assert(result.totalPage).toEqual(10); // 100 items with 10 items per page
    });
  
    // it('should return pagination object with specified page', () => {
    //   const limitItems = 10;
    //   const query = { page: '3' }; // Specified page
    //   const count = 100;
  
    //   const result = pagination(limitItems, query, count);
  
    //   expect(result.currentPage).toEqual(3);
    //   expect(result.limitItem).toEqual(limitItems);
    //   expect(result.skip).toEqual(20); // 10 items per page * (currentPage - 1)
    //   expect(result.totalPage).toEqual(10); // 100 items with 10 items per page
    // });
  
    // it('should calculate totalPage correctly for count not divisible by limitItems', () => {
    //   const limitItems = 10;
    //   const query = {};
    //   const count = 99; // 99 items
  
    //   const result = pagination(limitItems, query, count);
  
    //   expect(result.totalPage).toEqual(10); // 99 items with 10 items per page should result in 10 pages
    // });
  
    // it('should calculate totalPage correctly for count divisible by limitItems', () => {
    //   const limitItems = 10;
    //   const query = {};
    //   const count = 100; // 100 items
  
    //   const result = pagination(limitItems, query, count);
  
    //   expect(result.totalPage).toEqual(10); // 100 items with 10 items per page should result in 10 pages
    // });

    // it('should return pagination object with specified page', () => {
    //     const limitItems = 10;
    //     const query = { page: '3' }; // Specified page
    //     const count = 11;
        
    //     const result = pagination(limitItems, query, count);
    
    //     expect(result.currentPage).toEqual(3); // This expectation should fail
    //     expect(result.limitItem).toEqual(limitItems);
    //     expect(result.skip).toEqual(20); // 10 items per page * (currentPage - 1)
    //     expect(result.totalPage).toEqual(2); // 100 items with 10 items per page
    //   });
  });