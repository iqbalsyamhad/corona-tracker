/**
 * @format
 */
import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('App', () => {
  describe('Rendering', () => {
    it('should match to snapshot', () => {
      const component = shallow(<App />)
      expect(component).toMatchSnapshot()
    })
  })

  describe('Interaction', () => {
    describe('onChangeRegion', () => {
      it('should call getData', async () => {
        const component = shallow(<App />);
        const instance = component.instance();

        await instance.getData('MY');

        expect(component.state('country')).toEqual('Malaysia')

        // expect(mockOnChange).toHaveBeenCalled();
        // expect(mockOnChange).toHaveBeenCalledTimes(1);
      });
    });
  });
})