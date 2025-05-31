import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function useCourseSchoolYearId() {
  const navigate = useNavigate()
  const params = useParams()

  const [courseSchoolYearId, setCourseSchoolYearId] = useState<number | null>(null)
  
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/course-school-year')
    }

    setCourseSchoolYearId(parseInt(params.id as string))
  }, [navigate, params.id])

  return courseSchoolYearId
} 