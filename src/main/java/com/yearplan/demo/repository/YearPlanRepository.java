package com.yearplan.demo.repository;

import com.yearplan.demo.entity.YearPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YearPlanRepository extends JpaRepository<YearPlan, Long> {
}
