import S from '@ariiiman/s';
import Teams from './Teams';


export default ( $el ) => {

  const teams = new Teams( S.G.class('teams', $el)[0] );
        teams.on();

  $el.classList.add('js-ready');
};
