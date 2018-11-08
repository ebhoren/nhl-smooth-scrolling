import WebFont from 'webfontloader';
import S from '@ariiiman/s';
import App from './js/App';



// Prevent FOUT and miscalculations of .teams height
WebFont.load({
  active: () => new App( S.G.id('app') ),
  google: {
    families: ['Graduate'],
  },
});
