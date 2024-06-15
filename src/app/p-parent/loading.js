import React from 'react'

function loading() {
    return (

        <>

            <div className='w-full h-screen flex-col-center bg-transparent font-iranyekanBold'>
                <div className='mb-8 text-xl w-full text-center'>در حال دریافت اطلاعات</div>
                <div class=" w-full flex-center gap-2">
                    <div class="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                    <div class="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                    <div class="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                </div>
            </div>
        </>
    )
}

export default loading