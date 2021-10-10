import React, { memo, useState, useEffect } from 'react';
import { user } from '@vizality/discord';
import { getModule } from '@vizality/webpack';

const Flex = getModule(m => m.displayName === 'Flex');

const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);

const { xsmallAvatar, username } = getModule('xsmallAvatar');

export default memo(({ guildId, userId }) => {
  const [ animate, setAnimate ] = useState(false);
  const [ User, setUser ] = useState(user.getUser(userId));

  useEffect(() => {
    if (!User) {
      (async () => {
        setUser(await user.fetchUser(userId));
      })();
    }
  }, []);

  const onMouse = {
    onMouseEnter: () => setAnimate(true),
    onMouseLeave: () => setAnimate(false)
  };

  return <Flex {...User?.avatar?.startsWith('a_') ? onMouse : null}>
    {User && <AnimatedAvatar className={xsmallAvatar} src={User.getAvatarURL(guildId, 24, animate)} size={Sizes.SIZE_24} />}
    {User && <span className={username}>{User.tag}</span>}
  </Flex>;
});
