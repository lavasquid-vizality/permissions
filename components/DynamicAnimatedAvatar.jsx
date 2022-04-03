import React, { memo, useState, useEffect } from 'react';
import { getModule } from '@vizality/webpack';

import { Class } from '../constants';

const Flex = getModule(m => m.displayName === 'Flex');
const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);

const { getUser } = getModule(m => m.getUser && m.getUsers);
const { getUser: fetchUser } = getModule(m => m.getUser && m.fetchCurrentUser);

const { xsmallAvatar, username } = Class.xsmallAvatar;

export default memo(({ guildId, userId }) => {
  const [ animate, setAnimate ] = useState(false);
  const [ User, setUser ] = useState(getUser(userId));

  useEffect(() => {
    if (!User) {
      Promise.resolve(fetchUser(userId)).then(setUser);
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
