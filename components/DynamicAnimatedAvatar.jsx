import React, { memo, useState } from 'react';
import { getModule } from '@vizality/webpack';

import { Class } from '../constants';

const Flex = getModule(m => m.displayName === 'Flex');
const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);

const { xsmallAvatar, username } = Class.xsmallAvatar;

export default memo(({ guildId, user }) => {
  const [ animate, setAnimate ] = useState(false);

  const onMouse = {
    onMouseEnter: () => setAnimate(true),
    onMouseLeave: () => setAnimate(false)
  };

  return <Flex {...user?.avatar?.startsWith('a_') ? onMouse : null}>
    <AnimatedAvatar className={xsmallAvatar} src={user.getAvatarURL(guildId, 24, animate)} size={Sizes.SIZE_24} />
    <span className={username}>{user.tag}</span>
  </Flex>;
});
