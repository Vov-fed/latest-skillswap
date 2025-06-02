import { Segment } from "../../components/Segment";
import styles from "./index.module.scss";

export const NotLoggedIn = () => {
return (<div className={styles.mainPage}>
      <Segment title="SkillSwap –– a platform for professional skill exchange!" size={1} description="Let's exchange instead of paying each other!" className='mainSegment'>
      </Segment>
        <Segment title="What is SkillSwap?" size={2} className='sectionWhat'>
          <p>
            SkillSwap is a platform that allows users to exchange their professional skills with each other. Users can create profiles, list their skills, and search for others who have the skills they need. The platform facilitates skill exchanges by providing a messaging system and a calendar for scheduling meetings.
          </p>
        </Segment>
        <Segment title="How does it work?" size={2} className='sectionHow'>
          <p>
            Users can sign up for an account, create a profile, and list their skills. They can then search for other users who have the skills they need and send them a message to arrange a skill exchange. The platform also provides a calendar for scheduling meetings and a messaging system for communication.
          </p>
        </Segment>
        <Segment title="Why use SkillSwap?" size={2} className='sectionWhy'>
          <p>
            SkillSwap is a great way to learn new skills and share your expertise with others. It allows you to connect with like-minded individuals and expand your professional network. Whether you're looking to learn a new programming language, improve your public speaking skills, or gain experience in a new field, SkillSwap can help you find the right person to exchange skills with.
          </p>
          <p>
            SkillSwap is also a cost-effective way to learn new skills. Instead of paying for expensive courses or hiring a tutor, you can exchange your skills with someone else for free. This makes it accessible to everyone, regardless of their budget.
          </p>
          <p>
            In addition, SkillSwap is a great way to give back to the community. By sharing your skills with others, you can help them achieve their goals and make a positive impact on their lives. It's a win-win situation for everyone involved.
          </p>
          <p>
            Overall, SkillSwap is a unique and innovative platform that makes it easy to learn new skills and connect with others. Whether you're a student, a professional, or just someone looking to learn something new, SkillSwap has something to offer.
          </p>
        </Segment>
    </div>
    )
}