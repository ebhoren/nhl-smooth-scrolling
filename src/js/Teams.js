import S from '@ariiiman/s';

const SCROLL_DELTA_EASE = 0.45;
const SCROLL_EASE = 0.14;
const SCROLL_EASE_FRICTION = 0.92;

export default function Teams( $el ) {

  let scrollY     = 0,
      direction   = 0,
      maxScrollY  = 0,
      scrolling   = false;


  const teams   = Array.prototype.slice.call( S.G.class('team') ).map((el, index, array) => {
    return { el, y: 0, targetY: 0, ease: SCROLL_EASE, targetEase: SCROLL_EASE };
  });
  const nbTeams = teams.length;





  // list became clickable when scrolling is completed
  const onScrollFinish = () => {
    delay.stop();
    $el.classList.remove('js-scrolling');

    scrolling = false;
  };

  // recalculate maxScrollY
  const onResize = () => {
    maxScrollY = Math.max( 0, $el.offsetHeight - S.Win.h );
  };

  // scroll list to value passed as parameter
  const onScroll = (y) => {

    // ignore pointer-events when scrolling the list
    if( scrolling === false ) {
      scrolling = true;
      $el.classList.add('js-scrolling');
    }


    // perform some calculations before scrolling
    const scrollPercent = y / maxScrollY;

    // calculate targetIndex
    let targetIndex = (scrollPercent * nbTeams << 0) - direction * 2;

    // apply limits
    if( targetIndex < 0 ) targetIndex = 0;
    else if( targetIndex > nbTeams ) targetIndex = nbTeams;

    let ease = SCROLL_EASE;
    let i, n, team;

    // perform scroll
    if( direction > 0 ) {

      // if scrolling to bottom (direction = 1)
      //   - loop through teams from beginning
      //   - all element before targetIndex, default easing
      //   - all element after targetIndex, decremental easing
      for(i = 0, n = nbTeams; i<n; i++) {
        if( i > targetIndex ) ease *= SCROLL_EASE_FRICTION;

        team            = teams[i];
        team.targetY    = -y;
        team.targetEase = ease;
      }
    }
    else {

      // if scrolling to top (direction = -1)
      //   - loop through teams from end
      //   - all element after targetIndex, default easing
      //   - all element before targetIndex, decremental easing
      for(i = nbTeams - 1, n = 0; i>=n; i--) {
        if( i < targetIndex ) ease *= SCROLL_EASE_FRICTION;

        team            = teams[i];
        team.targetY    = -y;
        team.targetEase = ease;
      }
    }

    // reset delay
    delay.stop();
    delay.start = null;
    delay.run();
  };

  // calculate value to scroll from mouseWheel or touch events
  const onWheelTouch = (delta, type) => {
    scrollY  -= delta * SCROLL_DELTA_EASE;
    direction = delta > 0 ? -1 : 1;

    if( scrollY > maxScrollY ) scrollY = maxScrollY;
    else if( scrollY < 0 ) scrollY = 0;

    onScroll( scrollY );
  };

  // update teams position
  const update = () => {
    for(var i = 0, n = nbTeams, team; i<n; i++) {
      team        = teams[i];
      team.ease   = S.Lerp.init(team.ease, team.targetEase, 0.5);
      team.y      = S.Lerp.init(team.y, team.targetY, team.ease);

      team.el.style.transform = `translate3d(0px, ${S.R(team.y)}px, 0)`;
    }

    requestAnimationFrame( update );
  };


  // register event listeners
  const delay   = new S.Delay(onScrollFinish, 500);
  const ro      = new S.RO({ cb: onResize, throttle: { delay: 1000, onlyAtEnd: true } });
  const wheel   = new S.WT( onWheelTouch );



  // public API
  const on = () => {
    ro.run();
    ro.on();
    wheel.on();

    requestAnimationFrame( update );
  }
  const off = () => {
    ro.off();
    wheel.off();

    cancelAnimationFrame( update );
  }




  return {
    on,
    off,
  };
}
