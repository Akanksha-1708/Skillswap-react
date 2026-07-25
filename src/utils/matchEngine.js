// Calculates a compatibility score between two users.

export function calculateMatchScore(currentUser, otherUser) {
  if (!currentUser || !otherUser) return 0;

  if (currentUser.uid === otherUser.uid) {
    return 0;
  }

  let score = 0;

  const myTeaching = currentUser.teachingSkills || [];
  const myLearning = currentUser.learningSkills || [];

  const otherTeaching = otherUser.teachingSkills || [];
  const otherLearning = otherUser.learningSkills || [];

  // I want to learn what they teach
  myLearning.forEach((skill) => {
    if (otherTeaching.includes(skill)) {
      score += 20;
    }
  });

  // They want to learn what I teach
  myTeaching.forEach((skill) => {
    if (otherLearning.includes(skill)) {
      score += 20;
    }
  });

  // Same availability
  if (
    currentUser.availability &&
    currentUser.availability === otherUser.availability
  ) {
    score += 10;
  }

  // Same experience level
  if (
    currentUser.experience &&
    currentUser.experience === otherUser.experience
  ) {
    score += 5;
  }

  // Cap score at 100
  return Math.min(score, 100);
}