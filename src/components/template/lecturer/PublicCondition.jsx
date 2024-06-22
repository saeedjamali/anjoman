import { CheckIcon, NotificationIcon } from '@/utils/icon'
import React from 'react'

function PublicCondition({ isGeneralCondition, condition }) {
    return (
        <div>
            <div className='flex items-start justify-start gap-x-2'>
                {isGeneralCondition ?
                    <span className='text-green-500'>
                        <CheckIcon size={16} />
                    </span>
                    :
                    <NotificationIcon size={16} />
                }

                <p className='text-[12px] flex-1 text-right'>
                    {condition}
                </p>
            </div>
        </div>
    )
}

export default PublicCondition